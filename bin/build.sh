#!/bin/bash

color_blue="\033[36m"
color_reset="\033[m"
bold=$(tput bold)
normal=$(tput sgr0)

print_message() {
  printf "${bold}${color_blue}${1}${color_reset}${normal}\n\n"
}

packages=$(ls packages)

for package_name in ${packages}
do
  package="./packages/${package_name}"

  if [ ! -f "$package/package.json" ]; then
    print_message "Missing package.json for ${package_name}."
    continue
  fi

  print_message "Running \"yarn precommit\" for ${package_name}…"
  yarn --cwd ${package} build

  printf "\n"
done
