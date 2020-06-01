import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import Autosuggest from "react-autosuggest";
import { useTranslation } from "react-i18next";
import { SELECT_TOWN, CLEAR_TOWN } from "../stores";

const getSuggestions = (value, list, dataset) => {
  const inputValue = value.toLowerCase();
  const inputLength = inputValue.length;

  if (!inputLength) {
    return [];
  }
  const regexpInput = new RegExp(inputValue, "g");

  return list
    .filter(({ town }) => regexpInput.test(town.nome.toLowerCase()))
    .sort((t1, t2) => {
      const town1 = t1.town.nome.toLowerCase();
      const town2 = t2.town.nome.toLowerCase();
      if (!dataset[town1] && !dataset[town2]) {
        return 0;
      }
      if (dataset[town1] && !dataset[town2]) {
        return -1;
      }
      if (!dataset[town1] && dataset[town2]) {
        return 1;
      }
      return dataset[town1].length - dataset[town2].length;
    });
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.town.nome;

const getMetadata = (suggestion, dataset) => {
  const entries = dataset[suggestion.town.nome.toLowerCase()];
  if (!entries) {
    return "";
  }
  return ` - ${entries.length} dataset`;
};

function AutosuggestInput({ entries, data, handleTownSelection }) {
  const [value, updateValue] = useState("");
  const [suggestions, updateSuggestions] = useState([]);

  const [t] = useTranslation();

  const renderSuggestion = useCallback(
    (suggestion) => {
      return (
        <div>
          {suggestion.town.nome}
          {getMetadata(suggestion, data)}
        </div>
      );
    },
    [data]
  );

  const inputProps = {
    placeholder: t("search-town-input"),
    value,
    onChange: (_, { newValue }) => updateValue(newValue),
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={({ value }) => {
        updateSuggestions(getSuggestions(value, entries, data));
      }}
      onSuggestionsClearRequested={() => updateSuggestions([])}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(_, { suggestionValue }) => {
        handleTownSelection(suggestionValue.toLowerCase());
      }}
      inputProps={inputProps}
    />
  );
}

const mapStateToProps = () => ({});

const propsToState = (dispatcher) => ({
  handleTownSelection: (town) => dispatcher({ type: SELECT_TOWN, town }),
  clearTownSelection: () => dispatcher({ type: CLEAR_TOWN }),
});

export default connect(mapStateToProps, propsToState)(AutosuggestInput);
