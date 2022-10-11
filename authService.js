import auth from '@react-native-firebase/auth';

export const handleSignOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};
