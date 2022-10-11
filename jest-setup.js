
// jest.mock('@react-native-firebase/auth');
// jest.mock('@react-native-firebase/database');
jest.mock('@react-native-firebase/database', () => {
  const data = {name: 'unnamed'};
  const snapshot = {val: () => data};
  return {
    firebase: jest.fn().mockReturnValue({
      app: jest.fn().mockReturnValue({
        database: jest.fn().mockReturnValue({
          ref: jest.fn().mockReturnThis(),
          once: jest.fn(() => Promise.resolve(snapshot)),
        }),
      }),
    }),
  };
});

// mock calendar
jest.mock('react-native-calendars', () => {
  return {
    Calendar: () => null,
  };
});

// mock calendar
// jest.mock('@react-native-community/datetimepicker', () => {
//   return {
//     DateTimePicker: () => null,
//   };
// });
// jest.mock('@react-native-community/datetimepicker', function () {
//   const mockComponent = require('react-native/jest/mockComponent');
//   return mockComponent('@react-native-community/datetimepicker');
// });

jest.mock('@react-native-community/datetimepicker', () => {
  // eslint-disable-next-line import/no-unresolved
  const React = require('React');
  const PropTypes = require('prop-types');
  return class MockPicker extends React.Component {
    static Item = props => React.createElement('Item', props, props.children);
    static propTypes = {children: PropTypes.any};
    static defaultProps = {children: ''};

    render() {
      return React.createElement(
        'DateTimePicker',
        this.props,
        this.props.children,
      );
    }
  };
});
