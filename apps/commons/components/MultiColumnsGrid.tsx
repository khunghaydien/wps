import React from 'react';

type Props = {
  children: React.ReactNode;
  sizeList: Array<number>;
  className?: string;
  alignments?: Array<string>;
  onClick?: () => void;
  testId?: string;
};

/**
 * example usage:
 * <MultiColumnsGrid sizeList={[6,6]}>
 *   <div>Children 1</div>
 *   <div>Children 2</div>
 * </MultiColumnsGrid>
 *
 * will compile into the following html:
 * <MultiColumnsGrid sizeList={[6,6]}>
 *   <div className="slds-grid">
 *       <div className="slds-col slds-size--6-of-12 slds-align-middle">
 *         <div>Children 1</div>
 *       </div>
 *       <div className="slds-col slds-size--6-of-12 slds-align-middle">
 *         <div>Children 2</div>
 *       </div>
 *   </div>
 * </MultiColumnsGrid>
 *
 * You can also nest MultiColumnsGrid inside another MultiColumnsGrid.
 * alignments are used to control the alignment of the items inside the grid. Defaults to middle.
 *
 */
export default class MultiColumnsGrid extends React.Component<Props> {
  render() {
    const childrens = React.Children.toArray(this.props.children);
    const { sizeList, alignments, onClick, testId } = this.props;
    const className = this.props.className || '';
    const hasProperty = (props: any) => Object.keys(props).length !== 0;

    return (
      <div
        className={`slds-grid ${className}`}
        onClick={onClick}
        data-testid={testId}
      >
        {sizeList.map((size, index) => {
          const alignment = alignments ? alignments[index] : 'top';

          return (
            <div
              key={index}
              className={`slds-col slds-size--${size}-of-12 slds-align-${alignment}`}
            >
              {childrens[index] &&
              hasProperty((childrens[index] as React.ReactElement).props)
                ? childrens[index]
                : null}
            </div>
          );
        })}
      </div>
    );
  }
}
