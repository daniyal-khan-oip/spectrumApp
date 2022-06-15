import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import MainNavigator from './src/MainNavigator';
import {store, persistor} from './src/store';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainNavigator />
        <FlashMessage
          position="top"
          statusBarHeight="10"
          style={styles.flashMessage}
        />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  flashMessage: {
    position: 'absolute',
    zIndex: 9999,
    borderRadius: 12,
    top: 30,
    width: '96%',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default App;
