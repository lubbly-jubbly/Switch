import {Dimensions, StyleSheet} from 'react-native';
import COLOURS from './colours';

const {width, height} = Dimensions.get('window');

export const SIZES = {
  //globalls
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  //fontSizes
  navTitle: 25,
  h1: 30,
  h2: 20,
  h3: 17,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  //dimension
  width,
  height,
};

export const FONTS = {
  navTitle: {fontSize: SIZES.navTitle, fontWeight: '700'},
  largeTitleBold: {fontSize: SIZES.h2},
  h1: {
    fontSize: SIZES.h1,
    lineHeight: 36,
    fontWeight: '800',
    color: COLOURS.darkBlue,
  },
  h2: {
    fontSize: SIZES.h2,
    lineHeight: 30,
    fontWeight: '700',
    color: COLOURS.blue,
  },
  h3: {fontSize: SIZES.h3, lineHeight: 22, fontWeight: '600'},
  h4: {fontSize: SIZES.h4, lineHeight: 22, fontWeight: '500'},
  h5: {fontSize: SIZES.h5, lineHeight: 22, fontWeight: '400'},
  modalText: {fontSize: SIZES.h3, lineHeight: 22, fontWeight: '600'},
  modalSubHeadingText: {fontSize: SIZES.h4, lineHeight: 22, fontWeight: '400'},

  body1: {fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontSize: SIZES.body5, lineHeight: 22},
  userName: {fontSize: SIZES.h3, lineHeight: 22, fontWeight: '600'},
  smallBlue: {
    fontSize: SIZES.body3,
    lineHeight: 22,
    fontWeight: '600',
    color: COLOURS.blue,
  },
};

export const APPSTYLES = {
  itemContainer: {
    backgroundColor: COLOURS.light,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
  },

  inputContainer: {
    height: 45,
    backgroundColor: COLOURS.light,
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
    borderRadius: 10,
  },

  modal: {
    width: 260,
  },

  inputLabel: {
    marginVertical: 5,
    fontSize: 15,
    color: COLOURS.black,
  },

  titleContainer: {
    marginBottom: 20,
  },

  buttonText: {
    color: COLOURS.paleGreen,
    fontWeight: '600',
    fontSize: 17,
  },
};

export const MODALSTYLES = {
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLOURS.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderColor: COLOURS.paleGreen,
    borderWidth: 3,
  },
  button: {
    marginVertical: 15,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
};

const customTheme = {COLOURS, SIZES, FONTS};

export default customTheme;
