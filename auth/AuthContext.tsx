import { getAuth } from 'firebase/auth';
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
} from 'react';

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
  const [state, dispatch] = useReducer(reducer, initialState);

  const auth = getAuth();

  const initialize = useCallback(async () => {
    try {
      auth.onAuthStateChanged(async (user) => {
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

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      initialize();
    });
  }, [initialize]);

  // LOGOUT
  const logout = useCallback(() => {
    auth.signOut();
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

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
