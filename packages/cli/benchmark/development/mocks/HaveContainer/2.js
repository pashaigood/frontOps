import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import IconLocationOn from 'material-ui/svg-icons/communication/location-on'
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>
const nearbyIcon = <IconLocationOn />

export default class HaveContainer extends React.Component {
  state = {
    selectedIndex: 0
  }

  select = (index) => this.setState({selectedIndex: index})

  render () {
    return (
      <MuiThemeProvider>
        <AppBar
          title="Title"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Recents"
              icon={recentsIcon}
              onClick={() => this.select(0)}
            />
            <BottomNavigationItem
              label="Favorites"
              icon={favoritesIcon}
              onClick={() => this.select(1)}
            />
          </BottomNavigation>
        </Paper>
        <Card>
          <CardHeader
            title="URL Avatar"
            subtitle="Subtitle"
            avatar="images/jsa-128.jpg"
          />
          <CardMedia
            overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle"/>}
          >
            <img src="images/nature-600-337.jpg" alt=""/>
          </CardMedia>
          <CardTitle title="Card title" subtitle="Card subtitle"/>
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions>
            <FlatButton label="Action1"/>
            <FlatButton label="Action2"/>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    )
  }
}
