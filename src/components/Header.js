import React, {PureComponent} from 'react';
import {withTranslation} from 'react-i18next';

import LanguageSwitch from './LanguageSwitch';

class Header extends PureComponent {
  render() {
    const {t} = this.props;
    return (
      <section className="hero is-warning is-bold">
        <a href="https://github.com/dej611/abusi-edilizi-opendata/">
          <img
            className="top-left"
            src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67"
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
          />
        </a>
        <div className="move-to-right">
          <LanguageSwitch />
        </div>
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">{t('title')}</h1>
            <h2 className="subtitle">{t('subtitle')}</h2>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation()(Header);
