import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { PointerDown } from "./Icons";
import { CHANGE_LANG } from "../stores";

const languages = [
  {
    code: "it",
    label: "Italiano",
    flagURL: "https://www.countryflags.io/it/flat/16.png",
  },
  {
    code: "en",
    label: "English",
    flagURL: "https://www.countryflags.io/gb/flat/16.png",
  },
];

function LanguageSwitch({ changeLanguage, language }) {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();

  const updateLanguage = useCallback(
    (code) => {
      // TODO: fix this mess
      i18n.changeLanguage(code);
      changeLanguage(code);
    },
    [changeLanguage, i18n]
  );

  useEffect(() => {
    // check the URL if the language has been selected
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const lang = params.get("lang");
    if (languages.some(({ code }) => code === lang)) {
      updateLanguage(lang);
    }
  }, [updateLanguage]);

  const selectedLanguage = languages.find(({ code }) => code === language);

  return (
    <div className={`dropdown ${open ? "is-active" : ""}`}>
      <div className="dropdown-trigger">
        <button
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu3"
          onClick={() => setOpen(({ open }) => !open)}
        >
          <span>
            <img
              src={selectedLanguage.flagURL}
              alt={selectedLanguage.code}
              loading="lazy"
            />
          </span>
          <span className="left-margin-icon">{selectedLanguage.label}</span>
          <span className="icon is-small">
            <PointerDown />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu3" role="menu">
        <div className="dropdown-content">
          {languages.map(({ code, label, flagURL }) => (
            <a
              href="?lang=it"
              className="dropdown-item"
              onClick={(evt) => {
                evt.preventDefault();
                setOpen(false);
                updateLanguage(code);
              }}
              key={code}
            >
              <span>
                <img src={flagURL} alt={code} loading="lazy" />
              </span>
              <span className="left-margin-icon">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ navigation }) => {
  return {
    language: navigation.language,
  };
};

const propsToState = (dispatcher) => ({
  changeLanguage: (code) => dispatcher({ type: CHANGE_LANG, lang: code }),
});

export default connect(mapStateToProps, propsToState)(LanguageSwitch);
