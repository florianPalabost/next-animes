import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userForm;

  @Output() registered = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  async registerUser() {
    // todo check if username not already exist
    await this.userService.createUser(this.userForm.value.username);
    // say to the parent component that we have a new register
    this.registered.emit(true);
    // await this.router.navigate(['/']);
  }
}
