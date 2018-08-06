import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare var CaMDOIntegration;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public theInAppBrowser: InAppBrowser) {

  }

  	openUrl(url) {
    this.theInAppBrowser.create(url, "_blank", "location=true");
	}

	setCaAXACustomerID(cid) {
		CaMDOIntegration.setCustomerId(cid,null)
	}

}
