import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
} from 'react';
import auth from '@react-native-firebase/auth';
import { useGetMemberId } from './api/login';
import { useRouter } from 'expo-router';

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isInitialized: boolean;
  user: AuthUserType;
};

export type Auth0ContextType = {
  isInitialized: boolean;
  user: AuthUserType;
  logout: () => void;
};

enum Types {
  INITIAL = 'INITIAL',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  isInitialized: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

export const AuthContext = createContext<Auth0ContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (!user) router.push('login');
      const token = await user?.getIdToken();
      setToken(token ?? undefined);
    });
  }, [auth]);

  // 1. 유저 로그인
  // 1.1 유저가 로그인 되어있는지 확인
  const {
    data: serverMemberId,
    isLoading: isGetMemberIdLoading,
    isError: isGetMemberIdError,
  } = useGetMemberId({
    token: token,
  });

  useEffect(() => {
    if (isGetMemberIdLoading) return;
    if (serverMemberId === undefined && isGetMemberIdError) {
      router.push('login');
      return;
    }
    if (serverMemberId) router.push('initialWebview');
  }, [serverMemberId, isGetMemberIdLoading, isGetMemberIdError]);

  const initialize = useCallback(async () => {
    try {
      auth().onAuthStateChanged(async (user) => {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              displayName: user?.displayName,
              token: await user?.getIdToken(),
            },
          },
        });
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, [auth]);

  // LOGOUT
  const logout = useCallback(() => {
    auth().signOut();
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // INITIALIZE
  useEffect(() => {
    auth().onAuthStateChanged(async () => {
      initialize();
    });
  }, [initialize]);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      user: state.user,
      logout,
    }),
    [state.isInitialized, state.user, logout],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
