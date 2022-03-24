# Lazy
<p align="center">
  <a href="https://github.com/Bytebit-Org/roblox-Lazy/actions">
      <img src="https://github.com/Bytebit-Org/roblox-Lazy/workflows/CI/badge.svg" alt="CI status" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  </a>
  <a href="https://discord.gg/QEz3v8y">
    <img src="https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat" alt="Discord server" />
  </a>
</p>

Lazy is a simple implementation of a lazy loading wrapper for any type of value.

## Installation
### roblox-ts
Simply install to your [roblox-ts](https://roblox-ts.com/) project as follows:
```
npm i @rbxts/lazy
```

### Wally
[Wally](https://github.com/UpliftGames/wally/) users can install this package by adding the following line to their `Wally.toml` under `[dependencies]`:
```
Lazy = "bytebit/lazy@1.0.0"
```

Then just run `wally install`.

### From model file
Model files are uploaded to every release as `.rbxmx` files. You can download the file from the [Releases page](https://github.com/Bytebit-Org/roblox-Lazy/releases) and load it into your project however you see fit.

### From model asset
New versions of the asset are uploaded with every release. The asset can be added to your Roblox Inventory and then inserted into your Place via Toolbox by getting it [here.](https://www.roblox.com/library/9186407635/Lazy-Package)

## Documentation
Documentation can be found [here](https://github.com/Bytebit-Org/roblox-Lazy/tree/master/docs), is included in the TypeScript files directly, and was generated using [TypeDoc](https://typedoc.org/).

## Example
In this example, the Lazy class will be used to wait to load a reference to something in the world named the Objective, and it will do so by waiting for a RemoteEvent to be fired from the server saying it is ready.

<details>
  <summary>roblox-ts example</summary>

  ```ts
  import { ILazy, Lazy } from "@rbxts/lazy";
  import { ReplicatedService } from "@rbxts/services";

  type Objective = {}; // some type for the objective

  declare const loadObjective: () => Objective; // some function that loads the objective and returns it

  export class ObjectiveLoader {
    private objectiveLazyLoader: ILazy<Objective>;

    public constructor() {
      this.objectiveLazyLoader = new Lazy(loadObjective);

      this.waitForServerToSayObjectiveIsReady();
    }

    private waitForServerToSayObjectiveIsReady() {
      const remoteEvent = ReplicatedStorage.WaitForChild("ObjectiveReadiedRemoteEvent");
      assert(remoteEvent.IsA("RemoteEvent"));

      remoteEvent.OnClientEvent.Connect(() => {
        objectiveLazyLoader.getValue();
      });
    }
  }
  ```
</details>

<details>
  <summary>Luau example</summary>

  ```lua
  local ReplicatedStorage = game:GetService("ReplicatedStorage")

  local Lazy = require(path.to.modules["lazy"]).Lazy

  function loadObjective()
    -- some function that loads the objective and returns it 
  end

  local ObjectiveLoader = {}
  ObjectiveLoader.__index = ObjectiveLoader

  function new()
    local self = {}
    setmetatable(self, ObjectiveLoader)

    self._objectiveLazyLoader = Lazy.new(loadObjective)

    _waitForServerToSayObjectiveIsReady(self)

    return self
  end

  function _waitForServerToSayObjectiveIsReady(self)
      local remoteEvent = ReplicatedStorage:WaitForChild("ObjectiveReadiedRemoteEvent")
      assert(remoteEvent:IsA("RemoteEvent"))

      remoteEvent.OnClientEvent:Connect(function()
        objectiveLazyLoader:getValue()
      end)
  end

  return {
    new = new
  }
  ```
</details>
