import { htmlToTxt } from "./helper"

export class HtmlTxtValueConverter {
  fromView(value) {
    return htmlToTxt(value)
  }
}