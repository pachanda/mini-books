import { bindable, autoinject, children, child } from "aurelia-framework"
import { Router } from "aurelia-router"

@autoinject
export class MyHeader {
  @bindable title: string
  @bindable back: boolean = false

  constructor(private router: Router) { }

  attached() {
    console.log(`back: ${this.back}`)
  }

  navigateBack() {
    this.router.navigateBack()
  }
}