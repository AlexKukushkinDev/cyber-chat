import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorComponent } from './connector.component';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ConnectorComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ConnectorModule { }
