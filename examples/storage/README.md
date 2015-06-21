
# File Storage


## Install

```bash
$ npm install
```

## Configure

Add your user credentials in the `config.json` file

> You can use [Grant][grant] in your web app, or the [Grant OAuth][grant-oauth] playground to get access tokens


## Structure

```bash
$ node index.js [provider] [example_index] [item_id] [file_name]
```

- **[provider]** `box` | `dropbox` | `drive` | `onedrive`
- **[example_index]** `0` ... `6`
- **[item_id]** see the comments below on how this argument can look like
- **[file_name]** specify local file name to use when downloading, or copying


## Run


##### 0 - list

Lists the contents of a directory. The following example shows you how to list the contents of the root folder, but you can pass any valid `folder_id`

```bash
$ node index.js box 0 [folder_id] # '0'
$ node index.js dropbox 0 [folder_id] # '/'
$ node index.js drive 0
$ node index.js onedrive 0 [folder_id] # 'me'
```


##### 1 - stats folder

Get folder's metadata

```bash
$ node index.js box 1 [folder_id] # '0'
$ node index.js dropbox 1 [folder_id] # '/'
$ node index.js drive 1 [folder_id] # '1_nMwZ7s6qw0t6NUP4IEP8Ijh_YLmowGfnwp-3eCi'
$ node index.js onedrive 1 [folder_id] # 'folder.e8e0202776d99ad4.E8E02027D99AD4!103'
```


##### 2 - stats file

Get file's metadata

```bash
$ node index.js box 2 [file_id] # '32186290101'
$ node index.js dropbox 2 [file_path] # '/cat.png'
$ node index.js drive 2 [file_id] # '0B63Chjpn6xTkRzg4RE5tTDlublU'
$ node index.js onedrive 2 [file_id] # 'file.e8e0202776d99ad4.E8E0202776D99AD4!109'
```


##### 3 - upload file

Uploads a file. Specify absolute path to a file you want to upload, otherwise a small `cat.png` image will be uploaded for you

```bash
$ node index.js box 3 [absolute_path]
$ node index.js dropbox 3 [absolute_path]
$ node index.js drive 3 [absolute_path]
$ node index.js onedrive 3 [absolute_path]
```


##### 4 - download file

Downloads a file. The file will be stored in the `examples/storage` folder

```bash
# node index.js box 4 '32186290101' 'cat.png'
$ node index.js box 4 [file_id] [file_name]
# node index.js dropbox 4 '/cat.png' 'cat.png'
$ node index.js dropbox 4 [file_path] [file_name]
# node index.js drive 4 '0B63Chjpn6xTkRzg4RE5tTDlublU' 'cat.png'
$ node index.js drive 4 [file_id] [file_name]
# node index.js onedrive 4 'file.e8e0202776d99ad4.E8E0202776D99AD4!109' 'cat.png'
$ node index.js onedrive 4 [file_id] [file_name]
```


##### 5 - copy - put

Copy file from `box` to `dropbox` and `onedrive` without storing it locally

```bash
$ node index.js box 5 [box_file_id] [file_name] # '32186290101' 'cat.png'
```


##### 6 - copy - multipart

Copy file from `dropbox` to `box` and `drive` without storing it locally

```bash
$ node index.js dropbox 6 [dropbox_file_path] [file_name] # '/cat.png' 'cat.png'
```


  [grant]: https://github.com/simov/grant
  [grant-oauth]: https://grant-oauth.herokuapp.com
