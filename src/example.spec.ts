class FriendsList {
  friends = [];
  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    global.console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found!');
    }

    this.friends.splice(idx, 1);
  }
}

//tests
describe('FriendsList', () => {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initializes friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('Pedro');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announces frienship', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Pedro');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Pedro');
  });
});

describe('remove friend', () => {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('removes a friend from the list', () => {
    friendsList.addFriend('Pedro');
    expect(friendsList.friends[0]).toEqual('Pedro');
    friendsList.removeFriend('Pedro');
    expect(friendsList.friends[0]).toBeUndefined();
  });

  it('throws an error as friend does not exists', () => {
    expect(() => friendsList.removeFriend('Pedro')).toThrow(
      new Error('Friend not found!'),
    );
  });
});
