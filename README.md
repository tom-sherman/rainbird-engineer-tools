# Rainbird Engineer Tools
Adds [Rainbird](https://rainbird.ai/) knowledge authoring shortcuts to [Visual Studio Code](https://code.visualstudio.com/).

## Create concept instances
![concinsts](https://user-images.githubusercontent.com/9257001/46398240-7c03b780-c6ec-11e8-9efc-8a2b8d8cf44d.gif)


Input one concept instance name per line to transform them into valid `concinst` tags.

```
tom
dave
john
```

Triggering the command with `Person` as the concept name becomes:

```xml
<concinst name="tom" type="Person" />
<concinst name="dave" type="Person" />
<concinst name="john" type="Person" />
```

## Create facts (relationship instances)
![facts](https://user-images.githubusercontent.com/9257001/46398173-4ced4600-c6ec-11e8-9384-926709ccf875.gif)

Nest objects within a subject with indentation to generate a list of facts.

```
tom
  english
  spanish
dave
  welsh
```

Triggering the command with `speaks` as the relationship name becomes:

```xml
<relinst subject="tom" object="english" rel="speaks" />
<relinst subject="tom" object="spanish" rel="speaks" />
<relinst subject="dave" object="welsh" rel="speaks" />
```

## Create facts from CSV

![facts from table](https://giant.gfycat.com/JaggedCreepyFirefly.gif)

Transform a table into a list of facts.

Below is an example table format, as well as it's CSV representation from pasting into VSCode from Excel. Plural facts are supported by using multiple rows with the same subject in column `A`.

Note the top left cell (`A1`) is not used so can be left empty.

| |speaks|has age|has height|
|---|---|---|---|
|Fred|English|32|187|
|Jim|French|45|155|
|Jim|Spanish|||

```csv
,speaks,has age,has height
Fred,English,32,187
Jim,French,45,155
Jim,Spanish,,
```

```xml
<relinst type="speaks" subject="Fred" object="English" cf="100" />
<relinst type="has age" subject="Fred" object="32" cf="100" />
<relinst type="has height" subject="Fred" object="187" cf="100" />
<relinst type="speaks" subject="Jim" object="French" cf="100" />
<relinst type="has age" subject="Jim" object="45" cf="100" />
<relinst type="has height" subject="Jim" object="155" cf="100" />
<relinst type="speaks" subject="Jim" object="Spanish" cf="100" />
```

## RBLang/XML snippets

This extension also provides snippets which mirror those in the Rainbird RBLang editor.

*Note: These are not currently context aware so `condition` snippet will appear at any point in the XML.*
