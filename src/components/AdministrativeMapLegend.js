import React, {Fragment} from 'react';
import {string, func} from 'prop-types';
import {LegendLinear, LegendItem, LegendLabel} from '@vx/legend';
import {withTranslation} from 'react-i18next';

function Legend({scale, source, t}) {
  return (
    <Fragment>
      <div className="legend-container">
        <LegendLinear
          scale={scale}
          direction={'row'}
          labelFormat={(d, i) => {
            if (i === 0 || i === 4) {
              return d.toFixed(0);
            }
            return '';
          }}
        >
          {labels => (
            <div className="flex-row">
              {labels.map((label, i) => {
                const size = 15;
                return (
                  <LegendItem
                    key={`legend-linear-${i}`}
                    margin={'0 8px 8px 0'}
                    flexDirection="column"
                  >
                    <svg width={size} height={size} style={{margin: '2px 0'}}>
                      <circle
                        fill={label.value}
                        r={size / 2}
                        cx={size / 2}
                        cy={size / 2}
                      />
                    </svg>
                    <LegendLabel align={'left'} margin={0}>
                      {t(label.text)}
                    </LegendLabel>
                  </LegendItem>
                );
              })}
            </div>
          )}
        </LegendLinear>
      </div>
      <div className="legend-container">{source}</div>
    </Fragment>
  );
}

Legend.propTypes = {
  scale: func,
  source: string,
};

export default withTranslation()(Legend);
