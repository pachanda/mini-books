import {bindable} from 'aurelia-framework'
import {Router, RouterConfiguration, NavigationInstruction} from "aurelia-router"
import {autoinject} from "aurelia-framework"

import { Book } from '../../domain/Book'
import { HttpClient } from 'aurelia-fetch-client'
/*
edit / add - на основе того существует или нет эта книга
  и как это проверить?
    book.id == "" ? add : edit
edit / view - на основе просто флага. По умолчанию - view. 
  устанавливается в ручную. 
*/
@autoinject
export class BookView {
  @bindable isEdit = false
  
  book = new Book("", "empty name", "empty description")

  constructor(private router: Router, private client: HttpClient) { }

  activate(params, routerConfig: RouterConfiguration, inst: NavigationInstruction) {
    if (params.bid) {
      console.log("I want to edit/view an existing book...")
      this.fetchBook(params.bid)
    } else {
      console.log('NOW I WANT TO ADD A NEW BOOK!')
    }
  }

  async submit() {
    if (!this.book._id) {
      this.addThisBook()
    } else {
      this.updateThisBook()
      //   this.router.navigate('/', { replace: true, trigger: false });
    }
  }

  async fetchBook(bid: string) {
    const req = {
      query: `
        query {
          book(id: "${bid}") {
            _id
            name
            description
            chapters {
              _id
              name
            }
          }
        }
      `
    }
    console.log("fetchBook")
    const res = await this.client.fetch('graphql', {
      method: 'POST',
      body: JSON.stringify(req)
    })
    const json = await res.json()
    this.book = json.data.book
  }

  async addThisBook() {
    const req = {
      query: `
        mutation {
          createBook(name: "${this.book.name}", description: "${this.book.description}") {
            name,
            description
          }
        }
      `
    }
    const res = await this.client.fetch("graphql", {
      method: 'POST',
      body: JSON.stringify(req)
    })
    const json = await res.json()
    alert(`You added: ${json.data.createBook.name}`)
    this.router.navigateBack()
  }

  async updateThisBook() {
    const req = {
      query: `
        mutation {
          updateBook(
            _id: "${this.book._id}",
            name: "${this.book.name}",
            description: "${this.book.description}",
            chapters: [
              ${this.book.chapters.map(ch => `{ 
                ${ch._id ? `_id: "${ch._id}",` : ""} 
                name: "${ch.name}",
                text: "${ch.text}"
              }`)}
            ]
          ) {
            _id name description 
            chapters {
              _id name text  
            }
          }
        }
      `
    }
    const res = await this.client.fetch('graphql', {
      method: 'post',
      body: JSON.stringify(req)
    })
    const json = await res.json()
    alert(`updated book: ${JSON.stringify(json.data.updateBook)}`)
  }
}