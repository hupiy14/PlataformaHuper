import React from 'react';
import ThemeButton from './ThemeButton';



export const ContactCard = ({
  thumbnail,
  userName,
  location,
  status
}) => (
    <div className="contact-card-ch">
      <div className="profile-pic">
        <img src={thumbnail} />
      </div>
      <div className="name-location">
        <h1>{userName}</h1>
        <hr />
        <p>{location}</p>
      </div>
      <CardButtons />
      <Status status={status} />
    </div>
  );

export const Status = ({ status }) => (
  <div className="online-status">
    <span>
      <i className="lightbulb outline icon"
        aria-hidden="true"
      ></i>
    </span>
    <span>{status}</span>
  </div>
);

export const CardButtons = () => (
  <div className="card-buttons">
    <button>
      <i className="user plus icon"
        aria-hidden="true"
      ></i>
    </button>
    <button>
      <i className="comments icon"
        aria-hidden="true"
      ></i>
    </button>
    <button>
      <i className="thumbs up icon"
        aria-hidden="true"
      ></i>
    </button>
  </div>
);

export const StatusFeed = ({ statusUpdates }) => (
  <div className="status-feed-ch">
    <h1>Currently</h1>
    <ul>
      {statusUpdates.map((c) => (
        <Update updateContent={c} />
      ))}
    </ul>
  </div>
);

export const Update = ({ updateContent }) => (
  <li>
    <hr />
    <p>"{updateContent}"</p>
    <br />
    <span className="date">{new Date().toString()}</span>
  </li>
);

// --------- settings-ch page --------- 

  
export const settings = () => (
  <div className="settings-ch">
    <div className="settings-header">Display settings</div>
    <div className="themes-header">
      <span>Choose a theme:</span>
    </div>
    <div className='themes-wrapper'>
      <ThemeButton color={"red"} />
      <ThemeButton color={"orange"} />
      <ThemeButton color={"yellow"} />
      <ThemeButton color={"green"} />
      <ThemeButton color={"blue"} />
      <ThemeButton color={"purple"} />
    </div>
  </div>
);

// --------- Theme Selector Button ---------


// --------- menu bar --------- 


