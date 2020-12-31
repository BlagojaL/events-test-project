import React, { useContext } from 'react';
import { Route, NavLink } from "react-router-dom";
import { Menu, MenuItem, Icon } from "semantic-ui-react";
import HomePage from './components/HomePage';
import BookingsPage from './components/BookingsPage';
import EventsPage from './components/EventsPage';
import CustomDropdownMenu from './components/CustomDropDownMenu';
import { UserContext } from './components/UserContext';
import AuthPage from './components/AuthPage';
import UserPage from './components/UserPage';

const AppWrapper = () => {
  const context = useContext(UserContext);

  return (
    <div className="App">
      {!context.token && <AuthPage/>}
      {context.token &&
      <div
        style={{
          overflowY: "hidden",
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto auto 1fr",
          gridTemplateAreas: `
          "a a"
          "b c"
          "b d"
        `
        }}
      >
        <div style={{ gridArea: "a" }}>
          <div style={{
            height: 50,
            backgroundColor: '#4bbe65',
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: 'center',
          }}>
            <h1 style={{ color: "white", marginLeft: 10, paddingTop: 10 }}>Book Store</h1>
            <CustomDropdownMenu />
          </div>
        </div>
        <div style={{ gridArea: "b" }}>
          <Menu pointing vertical>
            <MenuItem
              as={NavLink}
              exact
              to="/"
            >
              <p><Icon name="home" /></p>
            </MenuItem>
            <MenuItem
              as={NavLink}
              exact
              to="/bookings"
            >
              <p><Icon name="clipboard list" /> Events</p>
            </MenuItem>
            <MenuItem
              as={NavLink}
              exact
              to="/events"
            >
              <p><Icon type="FontAwesome5" name="handshake" />Bookings</p>
            </MenuItem>
          </Menu>
        </div>
        <div
          style={{
            gridArea: "d",
            overflowY: "auto",
            padding: "10px"
          }}
        >
          <Route exact path="/" component={HomePage} />
          <Route exact path="/events" component={BookingsPage} />
          <Route exact path="/bookings" component={EventsPage} />
          <Route exact path="/user" component={UserPage} />
        </div>
      </div>
      }
    </div>
  )
}

export default AppWrapper;

