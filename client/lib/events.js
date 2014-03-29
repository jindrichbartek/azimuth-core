// Common event handlers

window.events = {
  savePage: function (e) {
    var pageData = utils.getFormValues("#pageEditForm");
    e.preventDefault();
    Azimuth.collections.Pages.update({_id: this._id}, {$set: pageData});
    
    // custom code starts
    var page_url = "/"+utils.getCurrentPage();
    
    Meteor.call('updateAllNavsTitle', page_url, pageData.title, function(error, id) {
  	if (error)
	  	noty({text: "Error: "+error.reason + ';', type: 'error'});
    });
    // custom code ends
        
		noty({text: 'Your page changes were saved.', type: 'success'});
  },
  showDeletePageModal: function (e) {
  	e.preventDefault();
    utils.openModal('#deletePageModal');
  },
  deletePage: function () {
    var page = utils.getCurrentPage();
    var title = page.title;
    utils.closeModal('#deletePageModal');

    // Delete from navs
    Azimuth.collections.Navigation.find().forEach(function(nav) {
      if(nav._id) Azimuth.collections.Navigation.update({ _id: nav._id }, {$pull : {  "pages" : { id: page._id }}});
    });

    Router.go('/');
    Azimuth.collections.Pages.remove(page._id);

		noty({text: '"' + title + '" was successfully deleted.', type: 'success'});
  }
};
