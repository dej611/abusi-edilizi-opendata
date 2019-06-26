import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {object, string} from 'prop-types';
import {withTranslation} from 'react-i18next';
import {Check, Info} from './Icons';
import Content from './Content';

class Table extends PureComponent {
  static propTypes = {
    town: string,
    rows: object,
  };
  render() {
    const {t, rows, town} = this.props;

    if (!town) {
      return null;
    }
    const townRows = rows[town];
    if (!townRows) {
      return (
        <div className="top-margin">
          <Content>{t('no-data')}</Content>
        </div>
      );
    }
    // autocomplete with towns in italy
    // if no result show a placeholder text with a CTA
    // if results explore it!
    // * perhaps zoom to the town from the whole map? - desktop version
    // * just show the town? - mobile version
    return (
      <div style={{overflowX: 'auto'}}>
        <table className="table is-fullwidth" style={{maxHeight: '450px'}}>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>{t('charts:Descrizione')}</th>
              <th
                className="tooltip is-tooltip-bottom"
                data-tooltip={t('tooltips:Categoria')}
              >
                {t('charts:Categoria')}
                <sup>
                  <Info />
                </sup>
              </th>
              <th
                className="tooltip is-tooltip-bottom"
                data-tooltip={t('tooltips:Geo')}
              >
                {t('charts:Geo')}
                <sup>
                  <Info />
                </sup>
              </th>
              <th
                className="tooltip is-tooltip-bottom"
                data-tooltip={t('tooltips:Tempo')}
              >
                {t('charts:Tempo')}
                <sup>
                  <Info />
                </sup>
              </th>
              <th
                className="tooltip is-tooltip-bottom"
                data-tooltip={t('tooltips:Anno')}
              >
                {t('charts:Anno')}
                <sup>
                  <Info />
                </sup>
              </th>
              <th>{t('charts:Fonte')}</th>
            </tr>
          </thead>
          <tbody>
            {townRows.map(
              ({name, types, geo, time, endDate, note, link}, i) => (
                <tr key={name}>
                  <th>&nbsp;</th>
                  <td>
                    {note ? (
                      <abbr title={note}>
                        <strong>{name}</strong>
                      </abbr>
                    ) : (
                      <strong>{name}</strong>
                    )}
                  </td>
                  <td>{types ? <Check /> : ' '}</td>
                  <td>{geo ? <Check /> : ' '}</td>
                  <td>{time ? <Check /> : ' '}</td>
                  <td>{endDate}</td>
                  <td>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = ({navigation}) => ({
  town: navigation.selected_town,
});

export default withTranslation()(connect(mapStateToProps)(Table));
