'use strict';

var React = require('react-native');
var api = require('../../utils/api');
var Separator = require('../helpers/separator');
var Search = require('../search/search');
var SelectedRequest = require('./request-selected');
var MakeRequest = require('./request-makeRequest');
var RecentsStore = require('../../stores/app-recentsStore');
var AppActions = require('../../actions/app-actions');

var {
  View,
  Text,
  TextInput,
  ListView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  rowContainer: {
    padding: 20,
  },
  container: {
    marginTop: 64,
    flex: 1,
    flexDirection: 'column',
  },
  searchInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    color: '#000'
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#4F7CAC',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    marginLeft: 120,
    marginRight: 120,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  title: {
    height: 40,
    backgroundColor: '#5F4461',
    justifyContent: 'center'
  },
  titleText: {
    color: '#fff',
    alignSelf: 'center'
  }

});

function getData (){
  return RecentsStore.getRequests();
}

class Requests extends React.Component {
  constructor(props) {
    super(props);
    self = this;
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      error: '',
      isLoading: false
    };
  }

  _onChange() {
    var data = getData();
    self.setState({dataSource: self.ds.cloneWithRows(data)});
    console.log('SETSTATE called on app-request: ', self.state);
  }

  componentDidMount() {
    RecentsStore.addChangeListener(this._onChange);
    var data = getData();
    this.setState({dataSource: this.ds.cloneWithRows(data)});
  }

  handlePress (rowData) {
    console.log('requests navigator',this.props.navigator);
    this.props.navigator.push({
      title: rowData.text,
      component: SelectedRequest,
      passProps: {
        request_id: rowData.id,
      }
    });
  }


  renderRow(rowData) {
    return (
      <View>
        <TouchableHighlight 
          style={styles.rowContainer}
          onPress={this.handlePress.bind(this, rowData)}
          underlayColor='white'>
          <Text> {rowData.text} </Text>
        </TouchableHighlight>
        <Separator/>
      </View>
    )
  }

  renderHeader() {
    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>POPULAR REQUESTS</Text>
      </View>
    )

  }

  handleChange(event){
    this.setState({
      search: event.nativeEvent.text
    })
  }

  handleSubmit(){
    this.props.navigator.push({
      title: "Search Results",
      component: Search,
      passProps: {
        searchQuery: this.state.search,
        tabName: 'photos',
        navigator: this.props.navigator
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <TextInput 
          style={styles.searchInput}
          value={this.state.search}
          onChange={this.handleChange.bind(this)} />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white">
          <Text style={styles.buttonText}> SEARCH </Text>
        </TouchableHighlight>
        <ActivityIndicatorIOS
          animating = {this.state.isLoading}
          color='#111'
          size='small'> 
        </ActivityIndicatorIOS>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderHeader={this.renderHeader} />
        <MakeRequest />
      </View>
    )
  }
}

module.exports = Requests;