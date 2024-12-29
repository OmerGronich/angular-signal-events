import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TreeCheckbox, TreeNode } from './tree-checkbox';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-tree-checkbox-page',
  standalone: true,
  template: `
    <app-tree-checkbox [node]="mockTree" (nodeChange)="mockTree = $event" />
    <pre>{{mockTree | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TreeCheckbox, JsonPipe],
})
export default class TreeCheckboxPage {
  mockTree: TreeNode = {
    label: 'Root',
    checked: false,
    indeterminate: false,
    children: [
      {
        label: 'Child 1',
        checked: false,
        indeterminate: false,
        children: [
          { label: 'Child 1.1', indeterminate: false, checked: false },
          { label: 'Child 1.2', indeterminate: false, checked: false },
        ],
      },
      {
        label: 'Child 2',
        checked: false,
        indeterminate: false,
        children: [
          { label: 'Child 2.1', indeterminate: false, checked: false },
          { label: 'Child 2.2', indeterminate: false, checked: false },
        ],
      },
    ],
  };
}
