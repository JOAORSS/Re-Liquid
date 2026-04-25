import './features-strip.css';
import { Strip } from './blocks/strip/strip';

export function Features(props: any) {

  if (!props.blocks || props.blocks.length === 0) return null;

  return (
    <div className="features">
      <div className="features-in">
        {props.blocks.map((block: any) => (
          <Strip settings={block.settings} />
        ))}
      </div>
    </div>
  );
};