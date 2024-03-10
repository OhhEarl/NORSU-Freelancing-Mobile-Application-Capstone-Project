{user && !isLoading ? (
    <>
        {isStudent !== undefined && isStudent.is_student === 0 ? (
          <Stack.Screen
            name="VerificationConfirmation"
            component={VerificationConfirmation}
            options={{ headerShown: false }}
          />
        ) : isStudent !== undefined && isStudent.is_student === 1 ? (
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="VerificationScreen"
            component={VerificationScreen}
            options={{ headerShown: false }}
          />
        )}
      </>
      ) : (
        <>
          {isStudent !== undefined && isStudent.is_student === 0 ? (
            <Stack.Screen
              name="VerificationConfirmation"
              component={VerificationConfirmation}
              options={{ headerShown: false }}
            />
          ) : isStudent !== undefined && isStudent.is_student === 1 ? (
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="VerificationScreen"
                component={VerificationScreen}
                options={{ headerShown: false }}
              />
              {/* You may add other screens if needed */}
            </>
          )}
        </>
      )}
  (
    <>
      <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
    </>
  )}
  