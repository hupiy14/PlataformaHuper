import React from 'react';
import { connect } from 'react-redux';
import { StatusFeed, ContactCard } from './settingsPage';

export const Profile = ({user}) => (
    <div>
      <ContactCard 
        thumbnail={user.thumbnail}
        userName={user.userName}
        location={user.location}
        status={user.status}
      />
      <StatusFeed
        statusUpdates={user.statusUpdates}
      />
    </div>
  );
  export const mapProfileStateToProps = (state) => ({
    user: state.user
  });
  export default connect(
    mapProfileStateToProps
  )(Profile);
  
  
  