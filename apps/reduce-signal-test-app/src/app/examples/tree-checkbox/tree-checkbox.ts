import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
              (ngModelChange)="onToggle($event)"
            />
            {{ nodeValue.label }}
          </label>
        </summary>
        <div class="children">
          @for (child of nodeValue.children; track child.label) {
            <app-tree-checkbox
              [node]="child"
              (nodeChange)="onChildUpdated($event, $index)"
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
            (ngModelChange)="onToggle($event)"
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
  node = model.required<TreeNode>();

  onToggle(checked: boolean) {
    this.node.set(this.updateChildren(checked));
  }

  onChildUpdated(child: TreeNode, index: number) {
    const treeNode = this.node();

    if (!treeNode.children) {
      return;
    }

    // Re-evaluate the checked and indeterminate state based on children
    const children = treeNode.children.map((c, i) => (i === index ? child : c));
    const allChecked = children.every((child) => child.checked);
    const noneChecked = children.every(
      (child) => !child.checked && !child.indeterminate,
    );
    const indeterminate = !allChecked && !noneChecked;
    const newNode = {
      ...treeNode,
      children: children,
      checked: allChecked,
      indeterminate,
    };

    // "Emit" the updated node so the parent can react
    this.node.set(newNode);
  }

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
}
