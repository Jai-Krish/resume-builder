import { DocumentReference } from '@angular/fire/firestore';

export interface Schema {
  id?: string;
  type: FieldTypes;
  field?: string;
  gridArea?: string;
  gridAreas?: string[][];
  gridRows?: string[];
  gridColumns?: string[];
  child?: DocumentReference[];
  path?: string;
  style?: Map<string, string>;
}

export enum FieldTypes {
  container = 'container',
  text = 'text',
  ul = 'ul',
  ol = 'ol',
}
