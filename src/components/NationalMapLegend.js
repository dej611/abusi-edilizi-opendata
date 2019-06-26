import React, {Fragment} from 'react';
import {bool, string, func} from 'prop-types';
import {LegendOrdinal, LegendLinear, LegendItem, LegendLabel} from '@vx/legend';
import {withTranslation} from 'react-i18next';

function Legend({isDetailed, townsScale, regionsScale, source, t}) {
  const scale = isDetailed ? townsScale : regionsScale;
  return (
    <Fragment>
      <div className="legend-container">
        {isDetailed ? (
          <LegendOrdinal scale={scale} direction={'row'}>
            {labels => (
              <div className="flex-row">
                {labels.map((label, i) => {
                  const size = 15;
                  return (
                    <LegendItem
                      key={`legend-linear-${i}`}
                      margin={'0 4px 0 0'}
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
                        {t(`charts:${label.text}`)}
                      </LegendLabel>
                    </LegendItem>
                  );
                })}
              </div>
            )}
          </LegendOrdinal>
        ) : (
          <LegendLinear
            scale={scale}
            direction={'row'}
            labelFormat={(d, i) => {
              if (i % 2 === 0) {
                return d.toFixed(1);
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
                      margin={'0 4px 0 0'}
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
                        {label.text}
                      </LegendLabel>
                    </LegendItem>
                  );
                })}
              </div>
            )}
          </LegendLinear>
        )}
      </div>
      <div className="legend-container">{source}</div>
    </Fragment>
  );
}

Legend.propTypes = {
  isDetailed: bool,
  townsScale: func,
  regionsScale: func,
  source: string,
};

export default withTranslation()(Legend);
