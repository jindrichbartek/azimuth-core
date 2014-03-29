Template.new_page.events = {
  'click .submit-new-page': function (e) {
    e.preventDefault();
    var raw_title = $('.new-page-title').val();
    var raw_slug = $('.new-page-slug').val();

    // Validate input
    if (raw_title == '' || raw_slug == '') {
    	noty({text: 'Please enter values for all fields.', type: 'error'});
      return false;
    }
    // custom code 'pageID ='
    pageID = Azimuth.collections.Pages.insert({
      title: raw_title,
      slug: raw_slug,
      contents: "<p>This page is empty.</p>",
      template: "page_default"
    });

    // Add to navigation
    var updatePageNav = function(location) {
      var currentPages = Azimuth.collections.Navigation.findOne({location: location}).pages;
      // custom code 'id: pageID,'
      currentPages.push({id: pageID, title: raw_title, url: '/'+raw_slug});
      Azimuth.collections.Navigation.update(Azimuth.collections.Navigation.findOne({location: location})._id, {$set: {pages: currentPages}});
    };

    if (utils.getSetting('addNewPagesToHeader')) {
      updatePageNav('header_active');
    } else {
      updatePageNav('header_disabled');
    }
    if (utils.getSetting('addNewPagesToFooter')) {
      updatePageNav('footer_active');
    } else {
      updatePageNav('footer_disabled');
    }

    Router.go('/' + raw_slug + '/edit');
  },
  'keyup .new-page-title': function () {
    var raw_title = $('.new-page-title').val();
    raw_title = raw_title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    $('.new-page-slug').val(raw_title);
  }
};
