// Site navigation
var updateNav = function(location) {
  return function() {
    var active = Azimuth.collections.Navigation.findOne({location: location + '_active'});
    var disabled = Azimuth.collections.Navigation.findOne({location: location + '_disabled'});
    Azimuth.collections.Navigation.update({_id: active._id}, {$set: {pages: $('#'+location + '_active').nestable('serialize')}});
    Azimuth.collections.Navigation.update({_id: disabled._id}, {$set: {pages: $('#'+location + '_disabled').nestable('serialize')}});
  }
}

Template.navigation.rendered = function() {
  $("#header_active, #header_disabled").nestable({maxDepth: 4, group: 1}).on('change', updateNav('header'));
  $("#footer_active, #footer_disabled").nestable({maxDepth: 1, group: 2}).on('change', updateNav('footer'));
}

Template.navigation.events = {
  'click .add-link': function(e) {
    e.preventDefault();

    Session.set('link-url', null);
    Session.set('link-location', $(e.currentTarget).closest('.row').find('.dd').first().attr('id'));

    // Clear modal form elements
    $('#linkModal').find('.form-control').val('');

    utils.openModal('#linkModal');
  },
  'click .edit-link': function(e) {
    e.preventDefault();

    Session.set('link-url', this.url);
    Session.set('link-location', $(e.currentTarget).closest('.dd').attr('id'));

    // Add link contents to modal form elements
    $('#linkModal').find('.link-url').val(this.url);
    $('#linkModal').find('.link-title').val(this.title);

    utils.openModal('#linkModal');
  },
  'click .edit-link-confirm': function(e) {
    e.preventDefault();
    var linkUrl = Session.get('link-url');
    var linkLocation = Session.get('link-location');

    var newUrl = $('.link-url').val();
    var newTitle = $('.link-title').val();

    if(linkUrl) {
      // Find item with link url and update attributes
      $("#" + linkLocation).find("li[data-url='"+linkUrl+"']").data('url', newUrl)
      $("#" + linkLocation).find("li[data-url='"+linkUrl+"']").data('title', newTitle)
      $("#" + linkLocation).find("li[data-url='"+linkUrl+"']").find('.dd-handle').html(newTitle);
    } else {
      // Add new link
      $("#" + linkLocation).find('.dd-list').prepend('<li class="dd-item" data-url="'+newUrl+'" data-title="'+newTitle+'"><div class="dd-handle">'+newTitle+'</div><div class="edit-link-container"><a href="#" class="edit-link"><i class="fa fa-edit"></i></a></div></li>');
    }

    // Save to navigation
    var location = Azimuth.collections.Navigation.findOne({location: linkLocation});
    Azimuth.collections.Navigation.update({_id: location._id}, {$set: {pages: $('#'+linkLocation).nestable('serialize')}});

    utils.closeModal('#linkModal');
  },
  'click .delete-link': function(e) {
    e.preventDefault();

    Session.set('link-url', this.url);
    Session.set('link-location', $(e.currentTarget).closest('.dd').attr('id'));

    utils.openModal('#deleteLinkModal');
  },
  'click .delete-link-confirm': function(e) {
    e.preventDefault();

    var linkUrl = Session.get('link-url');
    var linkLocation = Session.get('link-location');
    $("#" + linkLocation).find("li[data-url='"+linkUrl+"']").remove();

    var location = Azimuth.collections.Navigation.findOne({location: linkLocation});
    Azimuth.collections.Navigation.update({_id: location._id}, {$set: {pages: $('#'+linkLocation).nestable('serialize')}});

    noty({text: 'Link removed.', type: 'success'});
  }
}

Template.navigation.headerNav = function() {
  var nav = Azimuth.collections.Navigation.findOne({location: "header_active"});
  if (nav) return nav.pages;
  return false;
}

Template.navigation.headerNavDisabled = function() {
  var nav = Azimuth.collections.Navigation.findOne({location: "header_disabled"});
  if (nav) return nav.pages;
  return false;
}

Template.navigation.footerNav = function() {
  var nav = Azimuth.collections.Navigation.findOne({location: "footer_active"});
  if (nav) return nav.pages;
  return false;
}

Template.navigation.footerNavDisabled = function() {
  var nav = Azimuth.collections.Navigation.findOne({location: "footer_disabled"});
  if (nav) return nav.pages;
  return false;
}