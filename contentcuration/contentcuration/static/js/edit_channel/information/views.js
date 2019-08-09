var _ = require('underscore');
var BaseViews = require('edit_channel/views');
require('information.less');

var NAMESPACE = 'information';
var MESSAGES = {
  copied: 'Copied!',
  copy_failed: 'Copy Failed',
  prereq: 'Prerequisites',
  prereq_description:
    'Prerequisites help Kolibri recommend content that will allow learners ' +
    'to revisit key prior concepts, which may take the form of foundational skills or ' +
    'immediately relevant background information. For learners on Kolibri, these items ' +
    'will appear alongside the concept for recommended viewing.',
  channel_publish_id: 'Published Channel ID',
  published_prompt: 'Copy this channel ID into Kolibri version 0.6.0 and below:',
  published_token_prompt: 'Copy this channel token into Kolibri version 0.7.0 and above:',
  channel_publish_token: 'Published Channel Token',
  newer_version: 'Have a newer version of Kolibri?',
  older_version: 'Have an older version of Kolibri?',
  get_token: 'Get Channel Token',
  get_id: 'Get Channel ID',
  published_version: 'Published Version:',
  channel_sets: 'About Collections',
  channel_sets_description: 'What is a collection?',
  channel_sets_description_text:
    'A collection is a package of multiple Studio channels all associated with one ' +
    'token, the collection token! Use a collection token to make multiple channels available for import ' +
    'at once in Kolibri. You no longer have to import Channels into Kolibri using individual channel tokens.',
  channel_sets_instructions: 'How do I make one?',
  channel_sets_instructions_text:
    'You can make a collection by simply selecting which channels you ' +
    'want to package together. Remember to give your collection a title.',
  channel_sets_disclaimer:
    'You will need Kolibri version 0.12.0 or higher to import channel collections',
  channel_sets_compatability: 'Compatability',
};

var BaseInfoModalView = BaseViews.BaseModalView.extend({
  template: require('./hbtemplates/license_modal.handlebars'),
  modal_id: '.modal',
  className: 'information_wrapper',
  name: NAMESPACE,
  $trs: MESSAGES,
  modal: true,
  get_render_data: function() {
    return {};
  },
  initialize: function(options) {
    _.bindAll(this, 'loop_focus', 'set_indices', 'init_focus', 'closed_modal');
    this.data = options;
    this.render();
  },
  events: {
    'focus .input-tab-control': 'loop_focus',
  },
  render: function() {
    this.$el.html(
      this.template(this.get_render_data(), {
        data: this.get_intl_data(),
      })
    );
    $('body').append(this.el);
    this.$(this.modal_id).modal({ show: true });
    this.$(this.modal_id).on('hidden.bs.modal', this.closed_modal);
    this.$(this.modal_id).on('shown.bs.modal', this.init_focus);
  },
  init_focus: function() {
    this.set_indices();
    this.set_initial_focus();
  },
});

var PrerequisiteModalView = BaseInfoModalView.extend({
  template: require('./hbtemplates/prereq_modal.handlebars'),
  modal_id: '#prereq_modal',
});

var ChannelSetInformationModalView = BaseInfoModalView.extend({
  template: require('./hbtemplates/channel_set_modal.handlebars'),
  modal_id: '#channel_set_modal',
});

var PublishedModalView = BaseInfoModalView.extend({
  template: require('./hbtemplates/published_modal.handlebars'),
  publish_template: require('./hbtemplates/published.handlebars'),
  modal_id: '#published_modal',
  get_id: false,
  render: function() {
    BaseInfoModalView.prototype.render.call(this);
    this.render_id();
  },
  get_render_data: function() {
    return {
      get_id: this.get_id,
      channel: this.data.channel.toJSON(),
    };
  },
  events: {
    'click #modal-copy-btn': 'copy_publish_id',
    'focus .input-tab-control': 'loop_focus',
    'click .toggle_id': 'toggle_id',
  },
  copy_publish_id: function() {
    this.$('#modal-copy-text').focus();
    this.$('#modal-copy-text').select();
    var self = this;
    try {
      document.execCommand('copy');
      this.$('#modal-copy-btn').text(this.get_translation('copied'));
    } catch (e) {
      $('#modal-copy-btn').text(self.get_translation('copy_failed'));
    }
    setTimeout(function() {
      $('#modal-copy-btn').text(self.get_translation('copy').toUpperCase());
      self.set_initial_focus();
    }, 2500);
  },
  toggle_id: function() {
    this.get_id = !this.get_id;
    this.render_id();
  },
  render_id: function() {
    this.$('.modal-content').html(
      this.publish_template(this.get_render_data(), {
        data: this.get_intl_data(),
      })
    );
    this.init_focus();
  },
});

module.exports = {
  PrerequisiteModalView: PrerequisiteModalView,
  PublishedModalView: PublishedModalView,
  ChannelSetInformationModalView: ChannelSetInformationModalView,
};
