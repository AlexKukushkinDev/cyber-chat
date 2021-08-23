import { User } from './user';
import { Action } from './action';
import { Attributes } from './attributes';
import { Attribute } from '@angular/compiler/src/core';

export interface Message {
    from?: string;
    message?: any;
    attributes?: Attributes;
    type?: any;
}
