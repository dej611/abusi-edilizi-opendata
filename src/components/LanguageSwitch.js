import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {PointerDown} from './Icons';
import {CHANGE_LANG} from '../stores';

const languages = [
  {
    code: 'it',
    label: 'Italiano',
    flagURL: 'https://www.countryflags.io/it/flat/16.png',
  },
  {
    code: 'en',
    label: 'English',
    flagURL: 'https://www.countryflags.io/gb/flat/16.png',
  },
];

class LanguageSwitch extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    // check the URL if the language has been selected
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const lang = params.get('lang');
    if (languages.some(({code}) => code === lang)) {
      this.updateLanguage(lang);
    }
  }

  updateLanguage = code => {
    // TODO: fix this mess
    this.props.i18n.changeLanguage(code);
    this.props.changeLanguage(code);
  };

  changeLanguage = code => evt => {
    evt.preventDefault();
    this.setState({open: false});
    this.updateLanguage(code);
  };

  render() {
    const selectedLanguage = languages.find(
      ({code}) => code === this.props.language
    );
    return (
      <div className={`dropdown ${this.state.open ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu3"
            onClick={() => this.setState(({open}) => ({open: !open}))}
          >
            <span>
              <img src={selectedLanguage.flagURL} alt={selectedLanguage.code} />
            </span>
            <span className="left-margin-icon">{selectedLanguage.label}</span>
            <span className="icon is-small">
              <PointerDown />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu3" role="menu">
          <div className="dropdown-content">
            {languages.map(({code, label, flagURL}) => (
              <a
                href="?lang=it"
                className="dropdown-item"
                onClick={this.changeLanguage(code)}
                key={code}
              >
                <span>
                  <img src={flagURL} alt={code} />
                </span>
                <span className="left-margin-icon">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({navigation}) => {
  return {
    language: navigation.language,
  };
};

const propsToState = dispatcher => ({
  changeLanguage: code => dispatcher({type: CHANGE_LANG, lang: code}),
});

export default withTranslation()(
  connect(
    mapStateToProps,
    propsToState
  )(LanguageSwitch)
);
