import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrpcService } from './trpc.service';



@NgModule({
  providers: [TrpcService],
  imports: [
    CommonModule
  ],
})
export class ServicesModule { }
