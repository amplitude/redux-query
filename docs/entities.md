---
id: entities
title: Entities
---

With redux-query, network state is split into a single-layer of separate buckets called "entities". Each entity represents some sort of discrete piece of data that may change over time.

Entities can be primitives, like strings or numbers, but they're usually either arrays or object maps. Entities are identified by their "entity key", which is a string.

Entities are stored in your Redux store and are handled by the `entitiesReducer` provided by redux-query.

## Basic example

For example, you may have an entity that represents the current user's email address. In this case, the entity key could be called "email" and the value would be a string:

```json
{
  "email": "ryan@amplitude.com"
}
```

## Real-world example

Another more-complicated example. Let's say you are working on a music player app. The music player app has a sidebar where it shows all of the user's pinned playlists. In this case, you might have two entities to store the data required to power this feature: "playlistsById", which is an key-value-pair object map of playlist model objects identified by their unique ID, and "pinnedPlaylistIds", which is an ordered array of pinned playlist IDs.

This entity structure is [normalized](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape#normalizing-state-shape) – there's a single source of truth for each individual playlist model and separate data structures that reference those models through identifiers. The benefit of this design is more clear when we introduce a new feature relating to playlists. For example, let's say our music player app recommends playlists created by friends. For this feature, we could reuse the existing "playlistById" entity for storing the playlist metadata, and have a new entity, "recommendedPlaylistIds" to store the list of playlist IDs that we want to recommend to the user.

```json
{
  "playlistsById": {
    "x5in2l": {
      "name": "Chill mix",
      "songIds": ["oin3m3", "n209w8"]
    },
    "3nv1mc": {
      "name": "Workout mix",
      "songIds": ["jen3kl", "n0923n"]
    },
    "w193n4": {
      "name": "Warm Nights, Cool Beats",
      "songIds": ["1bn29d", "23xz0r"]
    }
  },
  "pinnedPlaylistIds": ["x5in2l", "3nv1mc"],
  "recommendedPlaylistIds": ["w193n4"]
}
```
