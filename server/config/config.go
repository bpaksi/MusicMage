package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Load reads server/.env (or ./.env) into the process environment if present.
// Variables already set in the environment are not overridden.
func Load() {
	_ = godotenv.Load("server/.env", ".env")
}

// Require returns the value of the named environment variable, or an error if it is unset or empty.
func Require(name string) (string, error) {
	value := os.Getenv(name)
	if value == "" {
		return "", fmt.Errorf("missing required environment variable %s (see server/.env.example)", name)
	}
	return value, nil
}

// Credentials returns the values of two required environment variables.
func Credentials(idName, secretName string) (id, secret string, err error) {
	if id, err = Require(idName); err != nil {
		return
	}
	secret, err = Require(secretName)
	return
}
