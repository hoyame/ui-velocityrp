drop table if exists characters;
create table characters
(
    id           int auto_increment
        primary key,
    playerId     int           null,
    infos        longtext      not null,
    money        int default 0 not null,
    vehicles     longtext      null,
    properties   longtext      null,
    lodaout      longtext      null,
    date_updated datetime      null,
    inventory    longtext      null,
    billings     longtext      null,
    job          longtext      null,
    org          longtext      null,
    phone_number varchar(10)   null
)
    engine = InnoDB 
    charset = utf8;

create index characters_players_id_fk
    on characters (playerId);

drop table if exists doors;
create table doors
(
    id            int auto_increment
        primary key,
    objects       longtext   not null,
    textLoc       longtext   not null,
    interactDist  double     not null,
    drawDist      double     not null,
    locked        tinyint(1) null,
    interactInVeh tinyint(1) not null,
    jobId         int        not null
);

drop table if exists garage;
create table garage
(
    id               int auto_increment
        primary key,
    name             varchar(128) charset utf8 not null,
    garageType       int                       null,
    ownerCharacterId longtext                  null,
    bought           longtext                  null,
    rent_dt          datetime                  null,
    date_updated     datetime                  null
)
    engine = InnoDB 
    charset = utf8;

drop table if exists organisations;
create table organisations
(
    id           int auto_increment
        primary key,
    name         varchar(128) charset utf8 not null,
    members      longtext                  null,
    data         longtext                  null,
    date_updated datetime                  null
)
    engine = InnoDB 
    charset = utf8;

drop table if exists companies;
create table companies
(
    id           int auto_increment        primary key,
    idJob        int                       null,
    name         varchar(128) charset utf8 not null,
    members      longtext                  null,
    inventory    longtext                  null,
    money        int default 0 not         null,
    lodaout      longtext                  null,
    date_updated datetime                  null
)
    engine = InnoDB 
    charset = utf8;


drop table if exists players;
create table players
(
    id           int auto_increment
        primary key,
    name         varchar(128) charset utf8 not null,
    steam        varchar(128) charset utf8 null,
    license      varchar(128) charset utf8 null,
    license2     varchar(128) charset utf8 null,
    discord      varchar(128) charset utf8 null,
    fivem        varchar(128) charset utf8 null,
    xbl          varchar(128) charset utf8 null,
    live         varchar(128) charset utf8 null,
    ip           varchar(256) charset utf8 null,
    hwid         varchar(256) charset utf8 null,
    `rank`       varchar(64) charset utf8  null,
    date_updated datetime                  null
)
    engine = InnoDB 
    charset = utf8;

drop table if exists properties;
create table properties
(
    id               int auto_increment
        primary key,
    name             varchar(128) not null,
    propertyType     longtext     null,
    ownerCharacterId int          null,
    inventory        longtext     null,
    bought           tinyint(1)   null,
    rent_dt          datetime     null,
    date_updated     datetime     null
)
    engine = InnoDB 
    charset = utf8;

drop table if exists sanctions;
create table sanctions
(
    id        int auto_increment
        primary key,
    playerId  int          null,
    reason    varchar(512) not null,
    banEnd    datetime     null,
    dt        datetime     null,
    createdBy int          null,
    createdByName longtext null
)
    engine = InnoDB 
    charset = utf8;

create index sanctions_players_id_fk
    on sanctions (playerId);

drop table if exists phone_calls;
create table phone_calls
(
    id       int auto_increment
        primary key,
    owner    varchar(10)                         not null,
    num      varchar(10)                         not null,
    incoming int                                 not null,
    time     timestamp default CURRENT_TIMESTAMP not null,
    accepts  int                                 not null
)
    engine = InnoDB 
    charset = utf8;

create index phone_calls_owner_index
    on phone_calls (owner);

drop table if exists phone_characters_contacts;
create table phone_characters_contacts
(
    id         int auto_increment
        primary key,
    characterId int                                      null,
    number     varchar(10) charset utf8mb4              null,
    display    varchar(64) charset utf8mb4 default '-1' not null
)
    engine = InnoDB 
    charset = utf8;

create index phone_characters_contacts_characterId_index
    on phone_characters_contacts (characterId);

drop table if exists phone_conversations;
create table phone_conversations
(
    id      int auto_increment
        primary key,
    isGroup tinyint(1) null
)
    engine = InnoDB 
    charset = utf8;

drop table if exists phone_conversations_members;
create table phone_conversations_members
(
    conversationId int         null,
    phoneNumber    varchar(10) null,
    constraint phone_conversations_members_phone_conversations_id_fk
        foreign key (conversationId) references phone_conversations (id)
            on update cascade on delete cascade
)
    engine = InnoDB 
    charset = utf8;

drop table if exists phone_messages;
create table phone_messages
(
    id             int auto_increment
        primary key,
    sender         varchar(10)              not null,
    owner          varchar(10)              not null,
    message        varchar(255) default '0' not null,
    time           int                      not null,
    isRead         int          default 0   not null,
    conversationId int                      null
)
    engine = InnoDB 
    charset = utf8;

create index phone_messages_owner_index
    on phone_messages (owner);

create index phone_messages_phone_conversations_id_fk
    on phone_messages (conversationId);

drop table if exists twitter_accounts;
create table twitter_accounts
(
    id         int auto_increment
        primary key,
    username   varchar(50) charset utf8 default '0' not null,
    password   varchar(64)              default '0' not null,
    avatar_url varchar(255)                         null,
    constraint username
        unique (username)
)
    engine = InnoDB 
    charset = utf8;

drop table if exists twitter_tweets;
create table twitter_tweets
(
    id       int auto_increment
        primary key,
    authorId int                                 not null,
    realUser varchar(50)                         null,
    message  varchar(256)                        not null,
    time     timestamp default CURRENT_TIMESTAMP not null,
    likes    int       default 0                 not null,
    constraint FK_twitter_tweets_twitter_accounts
        foreign key (authorId) references twitter_accounts (id)
)
    engine = InnoDB 
    charset = utf8;

drop table if exists twitter_likes;
create table twitter_likes
(
    id       int auto_increment
        primary key,
    authorId int null,
    tweetId  int null,
    constraint FK_twitter_likes_twitter_accounts
        foreign key (authorId) references twitter_accounts (id),
    constraint FK_twitter_likes_twitter_tweets
        foreign key (tweetId) references twitter_tweets (id)
            on delete cascade
)
    engine = InnoDB 
    charset = utf8;

ALTER TABLE `players` ADD `coins` INT(255) NOT NULL DEFAULT '0' AFTER `rank`;
ALTER TABLE `players` ADD `vip` INT NOT NULL DEFAULT '-1' AFTER `coins`;
ALTER TABLE `characters` ADD `jail` INT NOT NULL DEFAULT '-1' AFTER `phone_number`;

CREATE TABLE IF NOT EXISTS `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `playlist_songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playlist` int(11) DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;
