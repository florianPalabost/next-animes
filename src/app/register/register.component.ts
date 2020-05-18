import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AnimesService} from "../services/animes.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm;

  @Output() registered = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
              private animesService: AnimesService,
              private router: Router) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  async registerUser() {
    console.log(this.userForm.value);
    await this.animesService.createUser(this.userForm.value.username);
    this.registered.emit(true);
    // await this.router.navigate(['/']);
  }
}
