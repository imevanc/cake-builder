"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { User } from "@/types";
import { db } from "@/lib";

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string, isSignup?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateLoyaltyPoints: (pointsToAdd: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

const generateMockUserId = () => {
  // Access localStorage only when the function is called (client-side)
  let currentCounterValue = 1;
  if (typeof window !== "undefined") {
    currentCounterValue = parseInt(
      localStorage.getItem("mockUserIdCounter") || "1",
    );
  }

  const newId = `user-${currentCounterValue}`;

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "mockUserIdCounter",
      (currentCounterValue + 1).toString(),
    );
  }
  return newId;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserWithFirestore = useCallback(async (userData: User) => {
    if (!userData.id) return;
    const userRef = doc(db!, "users", userData.id);
    try {
      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error("Error syncing user to Firestore: ", error);
    }
  }, []);

  const fetchUserFromFirestore = useCallback(
    async (userId: string): Promise<User | null> => {
      if (!userId) return null;
      const userRef = doc(db!, "users", userId);
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          return userSnap.data() as User;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user from Firestore: ", error);
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      if (typeof window !== "undefined") {
        const storedUserString = localStorage.getItem("authUser");
        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString) as User;
          if (storedUser && storedUser.id) {
            const firestoreUser = await fetchUserFromFirestore(storedUser.id);
            if (firestoreUser) {
              setUser(firestoreUser);
              localStorage.setItem("authUser", JSON.stringify(firestoreUser));
            } else {
              await syncUserWithFirestore(storedUser);
              setUser(storedUser);
            }
          } else {
            localStorage.removeItem("authUser");
          }
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [fetchUserFromFirestore, syncUserWithFirestore]);

  const login = async (
    email: string,
    name: string,
    isSignup: boolean = false,
  ) => {
    setIsLoading(true);
    let userId = "";
    let existingUser: User | null = null;

    if (typeof window !== "undefined") {
      const localUserStr = localStorage.getItem("authUser");
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr) as User;
          if (localUser.email === email && localUser.id) {
            // check if ID is present
            userId = localUser.id;
            existingUser = await fetchUserFromFirestore(userId);
          }
        } catch (e) {
          console.error("Error parsing authUser from localStorage", e);
          localStorage.removeItem("authUser"); // Clear corrupted data
        }
      }
    }

    if (!userId) {
      userId = generateMockUserId();
    }

    if (!existingUser && userId) {
      existingUser = await fetchUserFromFirestore(userId);
    }

    let userData: User;

    if (existingUser) {
      userData = { ...existingUser, name };
    } else {
      userData = {
        id: userId,
        email,
        name,
        loyaltyPoints: 0,
      };
    }

    await syncUserWithFirestore(userData);
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("authUser", JSON.stringify(userData));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
    }
  };

  const updateLoyaltyPoints = async (pointsToAdd: number) => {
    if (!user || !user.id) return;

    const newLoyaltyPoints = (user.loyaltyPoints || 0) + pointsToAdd;
    const updatedUser = { ...user, loyaltyPoints: newLoyaltyPoints };

    const userRef = doc(db!, "users", user.id);
    try {
      await updateDoc(userRef, { loyaltyPoints: newLoyaltyPoints });
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("authUser", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating loyalty points in Firestore: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, updateLoyaltyPoints }}
    >
      {children}
    </AuthContext.Provider>
  );
};
