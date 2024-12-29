import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { event, on, reduceSignal } from 'reduce-signal';

export interface TreeNode {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  children?: Array<TreeNode>;
}

@Component({
  standalone: true,
  selector: 'app-tree-checkbox',
  template: `
    @let nodeValue = node();
    @if (nodeValue.children && nodeValue.children.length > 0) {
      <details open>
        <summary>
          <label>
            <input
              type="checkbox"
              [ngModel]="nodeValue.checked"
              [indeterminate]="nodeValue.indeterminate"
              (ngModelChange)="toggle($event)"
            />
            {{ nodeValue.label }}
          </label>
        </summary>
        <div class="children">
          @for (child of nodeValue.children; track child.label) {
            <app-tree-checkbox
              [node]="child"
              (nodeChange)="childChanged({ child: $event, index: $index })"
            />
          }
        </div>
      </details>
    } @else {
      <div class="leaf">
        <label>
          <input
            type="checkbox"
            [ngModel]="nodeValue.checked"
            (ngModelChange)="toggle($event)"
          />
          {{ nodeValue.label }}
        </label>
      </div>
    }
  `,
  styleUrls: ['./tree-checkbox.css'],
  imports: [FormsModule],
})
export class TreeCheckbox {
  toggle = event<boolean>();
  childChanged = event<{ child: TreeNode; index: number }>();

  _node = input.required<TreeNode>({ alias: 'node' });

  node = reduceSignal(
    () => this._node(),
    on(this.toggle, (checked) => this.updateChildren(checked)),
    on(this.childChanged, ({ child, index }, treeNode) => this.calculateStateBasedOnChildren(
      child,
      index,
      treeNode,
    )),
  );
  nodeChange = outputFromObservable(toObservable(this.node));

  private updateChildren(checked: boolean, node = this.node()): TreeNode {
    if (!node.children) {
      return {
        ...node,
        checked,
      };
    }
    const children = node.children.map((child) =>
      this.updateChildren(checked, child),
    );
    const allChecked = children.every((child) => child.checked);
    const noneChecked = children.every(
      (child) => !child.checked && !child.indeterminate,
    );
    const indeterminate = !allChecked && !noneChecked;
    return {
      ...node,
      checked,
      indeterminate,
      children,
    };
  }

  private calculateStateBasedOnChildren(
    child: TreeNode,
    index: number,
    treeNode: TreeNode,
  ) {
    const children = treeNode.children as TreeNode[];
    const updatedChildren = children.map((c, i) => (i === index ? child : c));
    const allChecked = updatedChildren.every((child) => child.checked);
    const noneChecked = updatedChildren.every(
      (child) => !child.checked && !child.indeterminate,
    );
    const indeterminate = !allChecked && !noneChecked;
    return {
      ...treeNode,
      children: updatedChildren,
      checked: allChecked,
      indeterminate,
    };
  }
}
