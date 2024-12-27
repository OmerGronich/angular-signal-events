import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CheckboxTreeComponent, TreeNode } from './tree-checkbox';

@Component({
  selector: 'app-tree-checkbox-page',
  standalone: true,
  template: ` <app-tree-checkbox [node]="mockTree" [parent]="null" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CheckboxTreeComponent],
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
