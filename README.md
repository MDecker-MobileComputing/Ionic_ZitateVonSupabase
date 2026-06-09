# Ionic-App "Zitate von Supabase" #

<br>

Dieses Repo enthält das Quellcode-Projekt für eine einfache Ionic/Angular-App, 
die mit [CapacitorHttp](https://capacitorjs.com/docs/apis/http) von einer auf 
[Supabase](https://supabase.com/) gehosteten REST-API zufällig ausgewählte
Zitate abruft.

<br>

![Screenshot](screenshot_1.png)

<br>

----

## Backend auf Supabase einrichten ##

<br>

Die folgenden SQL-Befehle sind auf der Web-Oberfläche vom Supabase im "SQL Editor" auszuführen
(alle Befehle können mit *einem* Klick auf den "Run"-Button auf einmal ausgeführt werden).

<br>

```
-- 1) Tabelle anlegen
CREATE TABLE IF NOT EXISTS public.zitate (
	id SERIAL PRIMARY KEY,
	zitat TEXT NOT NULL,
	autor TEXT NOT NULL
);

-- 2) Optional: Beispiel-Daten
INSERT INTO public.zitate (zitat, autor)
VALUES
	('Talk is cheap. Show me the code.', 'Linus Torvalds'),
	('Programs must be written for people to read, and only incidentally for machines to execute.', 'Harold Abelson'),
	('Simplicity is prerequisite for reliability.', 'Edsger W. Dijkstra')
ON CONFLICT DO NOTHING;

-- 3) Sicherstellen, dass "Row Level Security" (RLS) eingeschaltet ist
ALTER TABLE public.zitate ENABLE ROW LEVEL SECURITY;

-- 4) Funktion anlegen:
--    SECURITY DEFINER, damit die Funktion mit den Rechten des Owners läuft
--    SET search_path = '' laut Supabase-Empfehlung
CREATE OR REPLACE FUNCTION public.get_zufaelliges_zitat()
RETURNS TABLE(zitat TEXT, autor TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
	SELECT z.zitat, z.autor
		FROM public.zitate z
		ORDER BY RANDOM()
		LIMIT 1;
END;
$$;

-- 5) Direkte Rechte auf die Tabelle für anon entziehen
REVOKE ALL ON TABLE public.zitate FROM anon;
REVOKE ALL ON TABLE public.zitate FROM authenticated;
```

<br>

Mit folgendem SQL-Statement können weitere Zitate in die Tabelle eingefügt werden:
```
INSERT INTO "public"."zitate" ("zitat", "autor") VALUES 
    ('The universe is a big place, perhaps the biggest.', 'Kurt Vonnegut'),
    ('Behind every great man is a woman rolling her eyes.', 'Jim Carrey'),
    ('Imagination is more important than knowledge.', 'Albert Einstein'),
    ('If we knew what it was we were doing, it would not be called research, would it?', 'Albert Einstein'),
    ('Not everything that can be counted counts, and not everything that counts can be counted.', 'Albert Einstein'),
    ('Logic will get you from A to B. Imagination will take you everywhere.', 'Albert Einstein'),
    ('If it weren''t for electricity we''d all be watching television by candlelight.', 'George Gobel'),    
    ('Either we are alone in the universe, or we are not. Either thought is frightening.', 'Arthur C. Clarke'),
    ('I''m sure the universe is full of intelligent life. It''s just been too intelligent to come here.', 'Arthur C. Clarke'),
    ('The only way to do great work is to love what you do.', 'Steve Jobs'),    
    ('The best way to predict the future is to invent it.', 'Alan Kay'),        
    ('To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.', 'Ralph Waldo Emerson');
```

<br>

Mit dem folgenden SQL-Statement können wir die Funktion `get_zufaelliges_zitat()` testen:
```
SELECT * FROM get_zufaelliges_zitat()
```

<br>

----

## License ##

<br>

See the [LICENSE file](LICENSE.md) for license rights and limitations (BSD 3-Clause License) for the files in this repository.

<br>

