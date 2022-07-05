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
  h3: 16,
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
  body1: {fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontSize: SIZES.body4, lineHeight: 22},
  body5: {fontSize: SIZES.body5, lineHeight: 22},
  userName: {fontSize: SIZES.h3, lineHeight: 22, fontWeight: '600'},
};

export const APPSTYLES = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLOURS.light,
    flexDirection: 'column',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
});

const customTheme = {COLOURS, SIZES, FONTS};

export default customTheme;
