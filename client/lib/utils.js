// Utility methods common to many scripts

window.utils = window.utils || {};

// Get the page object corresponding to the current page slug
utils.getCurrentPage = function() {
  var notFound = {notFound: true, title: 'Sorry, we couldn\'t find the requested page'};
  if (!Router.current().path) return notFound;

  var page_slug = Router.current().path.split('/')[1];
  var page;

  if (!page_slug || page_slug == '') {
    page_slug = utils.getSetting('indexPage');
    page = Azimuth.collections.Pages.findOne({slug: page_slug});
    if(!page) {
      page = Azimuth.collections.Pages.findOne();
      if (!page) return notFound;
      else page_slug = page.slug;
    }
  }
  page = Azimuth.collections.Pages.findOne({slug: page_slug});

  if (!page) return notFound;
  return page;
}

// Get an array of form values for a form
utils.getFormValues = function(selector) {
  var values = {};

  // Turn form into array and handle special cases
  $.each($(selector).serializeArray(), function(i, field) {
    // if (field.name == 'tags') field.value = field.value.split(',');
  	if (field.value == 'on') field.value = true;
    values[field.name] = field.value;
  });
  $.each($(selector).find(':checkbox:not(:checked)'), function(i, field) {
  	values[field.name] = false;
  });
  return values;
}

utils.displayHumanReadableTime = function(timestamp){
  var a = new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  if(hour < 10) hour = "0" + hour;
  var min = a.getMinutes();
  if(min < 10) min = "0" + min;
  var sec = a.getSeconds();
  if(sec < 10) sec = "0" + sec;
  var time = month+'/'+date+'/'+year.toString().slice(2)+' @ '+hour+':'+min+':'+sec ;
  return time;
}

utils.displayHumanReadableDate = function(timestamp){
  var a = new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var time = month+'/'+date+'/'+year.toString().slice(2);
  return time;
}

// Get a template fragment
utils.loadTemplate = function(template) {
  return Meteor.render(function () {
    return Template[ template ](); // this calls the template and returns the HTML.
  });
}

// Get a setting value
utils.getSetting = function(settingName) {
  var settings = Azimuth.collections.Settings.findOne();
  if (!settings || !settingName) return '';
  return Azimuth.collections.Settings.findOne()[settingName];
}

// Get a block fragment filled with block data
utils.getBlockFragment = function(block) {
  if (block && block.template) {
    Template[block.template].block = block;
    var fragment = Template[block.template](); // this calls the template and returns the HTML.
  } else {
    console.log('Block not found (or has no template specified)' );
    return false;
  }

  return fragment;
}

// Set the default Noty settings
$.noty.defaults = {
    layout: 'bottomRight',
    theme: 'defaultTheme',
    type: 'alert',
    text: '',
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: 2000, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 5, // you can set max visible notification for dismissQueue true option
    closeWith: ['click'], // ['click', 'button', 'hover']
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {}
    },
    buttons: false // an array of buttons
};

// Open a modal
utils.openModal = function(selector) {
  if(!$(selector).hasClass('azimuth-modal')) {
    console.log('Modals need the .azimuth-modal class to work properly');
  }

  // Set an appropriate max-height for the modal and center it vertically
  $(selector).css('max-height', $(window).height() * .9 );
  $(selector).css('margin-top', '-' + ($(selector).height() / 2) - 50 + 'px');

  // Set up click handlers on any elements with the close class to close the modal
  $(selector).find('.close').click(function(e) {
    e.preventDefault();
    utils.closeModal(selector)
  });

  // Bind to escape key
  $(document).on('keyup.azimuth-modal', function(e) {
    if (e.keyCode == 27) { utils.closeModal(selector); }
  });

  // Open the modal
  $(selector).addClass('open');
}

// Close a modal
utils.closeModal = function(selector) {
  $(selector).removeClass('open');
  $(document).unbind('keyup.azimuth-modal');
}

// Get all unique block tags
// FIXME: If Meteor implements MongoDB's .distinct() method that would be much faster
utils.getDistinctBlockTags = function() {
  var blockTags = Azimuth.collections.Blocks.find({}, {fields: {tag: 1}, reactive: false});

  var tags = []
  blockTags.forEach(function(block) {
    tags = tags.concat(block.tag)
  });

  // Remove duplicates and any cruft
  var tagList = _.uniq(_.reject(tags, function(item) { return item == undefined }));

  // Return as array of objects
  return _.map(tagList, function(item) { return {tag: item}});
}
