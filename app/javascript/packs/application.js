// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
ActiveStorage.start()

// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);

// import "bootstrap"
import "stylesheets/application.scss"

require('packs/jquery-3.5.1.min');
require('packs/bootstrap.bundle.min');
require('packs/owl.carousel');
require('packs/isotope.pkgd.min');
require('packs/file_script');
require('packs/formatter.js');
require('packs/ethereum/web3.js');
require('packs/common.js');
require('packs/collections.js');

require('packs/jquery.magnific-popup.min');
require('packs/select2.min');
require('packs/smooth-scrollbar.js');
require('packs/jquery.countdown.min');

global.toastr = require("toastr")
global.BigNumber = require('bignumber.js');

setTimeout(function(){
  require('packs/chosen.jquery');
  require('packs/script');
  require('packs/main');
}, 500);
