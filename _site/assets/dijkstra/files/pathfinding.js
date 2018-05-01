const calcCompletedPathScore = function(nodesOnPath) {
  const self = this;
  // calculates the value of a completed path
  // for the various players
  if (this.debug) console.log("Calculating Path Score...", nodesOnPath);

  // used to keep track of which special tiles,
  // if any, are on the path
  const specialTiles = {};

  for (let i = 0; i < nodesOnPath.length; i++) {
    // add initial value of tile for score
    nodesOnPath[i].value = 1;
    // if tile has a type, push it to specialTiles for
    // later score calculating
    if (nodesOnPath[i].type) {
      if (!specialTiles[nodesOnPath[i].type]) {
        specialTiles[nodesOnPath[i].type] = [];
      }
      nodesOnPath[i].loaded = false;
      nodesOnPath[i].supplying = false;
      specialTiles[nodesOnPath[i].type].push(nodesOnPath[i]);
    }
  }

  const calcSpecialTileBonus = function(specialTiles, startType, endType, bonusAmount, mustBeLoaded) {
    // if there is at least one startType and one endType on path...
    if (specialTiles[startType] && specialTiles[endType]) {
      // for each of startType...
      for (let i = 0; i < specialTiles[startType].length; i++) {
        // if startType must be loaded, and isn't, then return
        if (mustBeLoaded && !specialTiles[startType][i].loaded) {
          if (self.debug) console.log(`${startType} has no suppliers.`);
          return;
        }
        // get dijkstraTree which contains costs to each node on Path
        let startId = specialTiles[startType][i].id;
        let dijkstraTree = getDijkstraTree(nodesOnPath, startId);
        // for each of endType...
        for (let j = 0; j < specialTiles[endType].length; j++) {
          // get dijkstraScore which contains optimalPath from
          // startType to endType
          let finishId = specialTiles[endType][j].id;
          if (self.debug) console.log(`${startType}:${startId} to ${endType}:${finishId}`);
          let dijkstraScore = getOptimalPathFromTree(dijkstraTree, finishId);
          // check validity
          // if greater than 2000, then invalid
          if (dijkstraScore.targetScore < 2000) {
            if (self.debug) console.log("valid", dijkstraScore.targetScore);
            // mark endType as 'loaded' for use in further calculation
            specialTiles[endType][j].loaded = true;
            specialTiles[startType][i].supplying = true;
            // add a bonus to the specialTile equal to the length of the
            // path between the startType and endType
            specialTiles[startType][i].value += (dijkstraScore.targetScore - 1000) * bonusAmount;
          } else {
            if (self.debug) console.log("invalid - Path passes through another special Node.", dijkstraScore.targetScore)
          }
        }
      }
    } else {
      if (self.debug) console.log("At least one type of endpoint is missing.");
    }
  };

  // mine->factory, bonus: 1, mustBeLoaded = false
  calcSpecialTileBonus(specialTiles, 'mine', 'factory', 1, false);
  // factory->house, bonus: 2, mustBeLoaded = true
  calcSpecialTileBonus(specialTiles, 'factory', 'house', 2, true);

  if (this.debug) console.log(specialTiles, nodesOnPath);

  // for each node on the path that belongs to player,
  // give that player the value of the tile
  for (let i = 0; i < nodesOnPath.length; i++) {
    if (nodesOnPath[i].playedBy) {
      this.players[nodesOnPath[i].playedBy - 1].addPoints(nodesOnPath[i].value);
    }
  }
};

const getDijkstraTree = function(path, startId) {
  // build a tree of costs and parents from startId
  // to every other node on the path

  // create initial objects and lists
  const costs = {};
  const parents = {};
  const processed = [];

  // set start cost = 0
  costs[startId] = 0;

  // set tentative cost for all other nodes to Infinity
  for (let i = 0; i < path.length; i++) {
    if (path[i].id != startId) {
      costs[path[i].id] = Infinity;
    }
  }

  // currentNode = start node
  let currentNode = getLowestNode(costs, processed);

  // as long as there are nodes which are not in processed...
  while (currentNode) {
    let cost = costs[currentNode]; // cost of current node
    let children = getNodeById(path, currentNode).neighbors;
    let childrenCosts = getCostsOfNeighbors(path, children); // 1 or 1001

    for (let n in childrenCosts) {
      let newCost = cost + childrenCosts[n]; // cost of current node + travel
      if (costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = currentNode;
      }
    }

    // add currentNode to processed list after processing
    processed.push(currentNode);
    
    // get lowest, unprocessed node
    currentNode = getLowestNode(costs, processed);
  }

  // return path, costs, and parents for use with getOptimalPathFromTree
  return {path, costs, parents};
};

const getOptimalPathFromTree = function(tree, finishId) {

  // return array of actual nodes on the optimal path
  let optimalPath = [getNodeById(tree.path,finishId)];
  let parent = tree.parents[finishId];
  while (parent) {
    optimalPath.push(getNodeById(tree.path,parent));
    parent = tree.parents[parent];
  }
  optimalPath.reverse();

  // return int of the target Score
  // used to check validity. if >2000,
  // then invalid
  const targetScore = tree.costs[finishId];

  return {optimalPath, targetScore};
};

const getLowestNode = function(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node) && costs[node] < 1000) { // costs[node] just makes it more efficient;
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

const getNodeById = function(path, id) {
  for (let i = 0; i < path.length; i++) {
    if (path[i].id == id) return path[i];
  }
}

const getCostsOfNeighbors = function(path, neighbors) {
  const costs = {};
  for (let i = 0; i < neighbors.length; i++) {
    if (getNodeById(path, neighbors[i]).type) {
      costs[neighbors[i]] = 1001;
    } else {
      costs[neighbors[i]] = 1;
    }
  }
  return costs;
}
