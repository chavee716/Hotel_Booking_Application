import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import { useContext, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const HeaderSearchBar = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // For user authentication (optional)
  const { dispatch } = useContext(SearchContext);

  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
    }));
  };

  const handleSearch = () => {
    if (!destination) {
      alert("Please enter a destination!");
      return;
    }

    // Dispatch the search action
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });

    // Navigate to the hotels page with search parameters
    navigate("/hotels", { state: { destination, dates, options } });
  };

  return (
    <div className="header">
      <div className="headerSearch">
        {/* Destination Input */}
        <div className="headerSearchItem">
          <FontAwesomeIcon icon={faBed} className="headerIcon" />
          <input
            type="text"
            placeholder="Where are you going?"
            className="headerSearchInput"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Date Selector */}
        <div className="headerSearchItem">
          <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
          <span
            onClick={() => setOpenDate(!openDate)}
            className="headerSearchText"
          >{`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
            dates[0].endDate,
            "MM/dd/yyyy"
          )}`}</span>
          {openDate && (
            <DateRange
              editableDateInputs
              onChange={(item) => setDates([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dates}
              className="date"
              minDate={new Date()}
            />
          )}
        </div>

        {/* Options Selector */}
        <div className="headerSearchItem">
          <FontAwesomeIcon icon={faPerson} className="headerIcon" />
          <span
            onClick={() => setOpenOptions(!openOptions)}
            className="headerSearchText"
          >{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
          {openOptions && (
            <div className="options">
              {[
                { label: "Adult", name: "adult", min: 1 },
                { label: "Children", name: "children", min: 0 },
                { label: "Room", name: "room", min: 1 },
              ].map((item) => (
                <div className="optionItem" key={item.name}>
                  <span className="optionText">{item.label}</span>
                  <div className="optionCounter">
                    <button
                      disabled={options[item.name] <= item.min}
                      className="optionCounterButton"
                      onClick={() => handleOption(item.name, "d")}
                    >
                      -
                    </button>
                    <span className="optionCounterNumber">
                      {options[item.name]}
                    </span>
                    <button
                      className="optionCounterButton"
                      onClick={() => handleOption(item.name, "i")}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="headerSearchItem">
          <button className="headerBtn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearchBar;