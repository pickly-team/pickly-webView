import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  rightButton?: ReactNode;
  backButtonCallback?: () => void;
}

const Header = ({
  showBackButton = false,
  title,
  rightButton,
  backButtonCallback,
}: HeaderProps) => {
  const router = useRouter();

  const onClickBackButton = () => {
    router.back();
    backButtonCallback && backButtonCallback();
  };
  return (
    <View style={styles.headerContainer}>
      <View style={styles.backButtonAndTitleWrapper}>
        {showBackButton && (
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="white"
            onPress={onClickBackButton}
          />
        )}
        {title && <Text>{title}</Text>}
      </View>
      <View style={styles.rightButtonWrapper}>{rightButton}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    top: -11,
    left: 0,
    backgroundColor: Colors.dark.background,
    paddingLeft: 20,
    paddingRight: 20,
    height: 56,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  backButtonAndTitleWrapper: {
    display: 'flex',

    height: 56,
    alignItems: 'center',

    flexDirection: 'row',
  },
  rightButtonWrapper: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});
